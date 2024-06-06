using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SIMEXPRO.API.Models.ModelsAduana;
using SIMEXPRO.BussinessLogic.Services.EventoServices;
using SIMEXPRO.Entities.Entities;
using SIMEXPRO.API.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SIMEXPRO.API.Controllers.ControllersAduanas
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonaJuridicaController : Controller
    {
        private readonly AduanaServices _aduanaServices;
        private readonly IMapper _mapper;
        private readonly IMailService _mailService;

        public PersonaJuridicaController(AduanaServices AduanaServices, IMapper mapper, IMailService mailService)
        {
            _aduanaServices = AduanaServices;
            _mapper = mapper;

        }

        [HttpGet("Listar")]
        public IActionResult Index()
        {
            var listado = _aduanaServices.ListarPersonaJuridica();
            listado.Data = _mapper.Map<IEnumerable<PersonaJuridicaViewModel>>(listado.Data);
            return Ok(listado);
        }

        [HttpPost("Insertar")]
        public IActionResult Insertar(PersonaJuridicaViewModel personaJuridica)
        {
            var mapped = _mapper.Map<tbPersonaJuridica>(personaJuridica);
            var datos = _aduanaServices.InsertarPersonaJuridica(mapped);
            return Ok(datos);
        }

        [HttpPost("InsertarTap2")]
        public IActionResult InsertarTap2(PersonaJuridicaViewModel personaJuridica)
        {
            var mapped = _mapper.Map<tbPersonaJuridica>(personaJuridica);
            var datos = _aduanaServices.InsertarPersonaJuridicaTap2(mapped);
            return Ok(datos);
        }

        [HttpPost("InsertarTap3")]
        public IActionResult InsertarTap3(PersonaJuridicaViewModel personaJuridica)
        {
            var mapped = _mapper.Map<tbPersonaJuridica>(personaJuridica);
            var datos = _aduanaServices.InsertarPersonaJuridicaTap3(mapped);
            return Ok(datos);
        }

        [HttpPost("InsertarTap4")]
        public IActionResult InsertarTap4(PersonaJuridicaViewModel personaJuridica)
        {
            var mapped = _mapper.Map<tbPersonaJuridica>(personaJuridica);
            var datos = _aduanaServices.InsertarPersonaJuridicaTap4(mapped);
            return Ok(datos);
        }

        [HttpPost("Editar")]
        public IActionResult Update(PersonaJuridicaViewModel concepto)
        {
            var item = _mapper.Map<tbPersonaJuridica>(concepto);
            var respuesta = _aduanaServices.ActualizarPersonaJuridica(item);
            return Ok(respuesta);
        }

        [HttpPost("FinalizarContratoJuridica")]
        public IActionResult FinalizarContratoJuridica(int peju_Id)
        {
            var datos = _aduanaServices.FinalizarContrato(peju_Id);
            return Ok(datos);
        }

        [HttpPost("EliminarJuridica")]
        public IActionResult Eliminar(int peju_Id, int pers_Id)
        {
            var respuesta = _aduanaServices.EliminarJuridica(peju_Id, pers_Id);
            return Ok(respuesta);
        }

        [HttpPost("Delete")]
        public IActionResult Delete(PersonaJuridicaViewModel concepto)
        {
            var item = _mapper.Map<tbPersonaJuridica>(concepto);

            var respuesta = _aduanaServices.EliminarPersonaJuridica(item);

            if (respuesta.Code == 200)
            {
                return Ok(respuesta);
            }
            else
            {
                return BadRequest(respuesta);
            }
        }

        [HttpGet("EnviarCodigo")]
        public IActionResult CodigoCorreo(string correo)
        {
            Random random = new Random();
            string codigo = random.Next(10000, 100000).ToString();

            if (!string.IsNullOrEmpty(correo))
            {
                _aduanaServices.InsertarCodigoj(correo, codigo);
                MailData mailData = new MailData
                {
                    EmailToId = correo,
                    EmailToName = "Confirmación de Correo Electrónico",
                    EmailSubject = "Código para confirmar correo electrónico",
                    EmailBody = "Código " + codigo
                };
                _mailService.SendMail(mailData);
                return Ok(new { message = "Código enviado con éxito" });
            }

            return BadRequest(new { message = "Correo inválido" });
        }





        [HttpPost("ConfirmarCodigo")]
        public IActionResult ConfirmarCodigo(string codigo)
        {
            var result = _aduanaServices.ConfirmarCodigoj(codigo);

            if (result.Success)
            {
                return Ok(new { message = "Exito" });
            }
            else
            {
                return BadRequest(new { message = "Código incorrecto" });
            }
        }
        [HttpGet("EnviarCodigo2")]
        public IActionResult CodigoCorreo2(string correo)
        {
            Random random = new Random();
            string codigo = random.Next(10000, 100000).ToString();

            if (!string.IsNullOrEmpty(correo))
            {
                _aduanaServices.InsertarCodigoj2(correo, codigo);
                MailData mailData = new MailData
                {
                    EmailToId = correo,
                    EmailToName = "Confirmación de Correo Electrónico",
                    EmailSubject = "Código para confirmar correo electrónico",
                    EmailBody = "Código " + codigo
                };
                _mailService.SendMail(mailData);
                return Ok(new { message = "Código enviado con éxito" });
            }

            return BadRequest(new { message = "Correo inválido" });
        }


        [HttpPost("ConfirmarCodigo2")]
        public IActionResult ConfirmarCodigo2(string codigo)
        {
            var result = _aduanaServices.ConfirmarCodigoj2(codigo);

            if (result.Success)
            {
                return Ok(new { message = "Exito" });
            }
            else
            {
                return BadRequest(new { message = "Código incorrecto" });
            }
        }
    }
}
